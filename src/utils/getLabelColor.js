// 라벨 색 반환하는 util
export const getLabelColor = (label) => {
    switch (label) {
      case '빨강':
        return '#ff6347';
      case '초록':
        return '#32cd32';
      case '파랑':
        return '#1e90ff';
      case '핑크':
        return '#f89cf0';
      case '보라':
        return '#7a3689';
      default:
        return '#d3d3d3';
    }
  };
  